package org.insurechain;

import org.adridadou.ethereum.EthereumFacade;
import org.adridadou.ethereum.provider.PrivateEthereumFacadeProvider;
import org.adridadou.ethereum.provider.PrivateNetworkConfig;
import org.adridadou.ethereum.provider.StandaloneEthereumFacadeProvider;
import org.adridadou.ethereum.values.EthAccount;
import org.adridadou.ethereum.values.EthAddress;
import org.adridadou.ethereum.values.SoliditySource;
import org.adridadou.exception.EthereumApiException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.ExecutionException;

import static org.adridadou.ethereum.values.EthValue.ether;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

/**
 * Created by davidroon on 21.12.16.
 * This code is released under Apache 2 license
 */
public class InsurechainTest {

    private final StandaloneEthereumFacadeProvider provider = new StandaloneEthereumFacadeProvider();
    private final EthAccount mainAccount = provider.getLockedAccount("mainAccount").decode("");
    private final EthAccount insuranceAccount = provider.getLockedAccount("insuranceAccount").decode("");
    private final EthAccount retailerAccount = provider.getLockedAccount("retailerAccount").decode("");
    private EthereumFacade ethereum;
    private SoliditySource soliditySource = SoliditySource.from(new File("contracts/Insurechain.sol"));
    private Insurechain insureChainContractFromAdmin;
    private Insurechain insureChainContractFromInsurance;
    private Insurechain insureChainContractFromRetailer;

    @Rule
    public final ExpectedException exception = ExpectedException.none();

    public InsurechainTest() throws Exception {
    }

    @Before
    public void before() throws Exception {
        ethereum = new PrivateEthereumFacadeProvider().create(PrivateNetworkConfig.config()
                .reset(true)
                .initialBalance(mainAccount, ether(100))
                .initialBalance(insuranceAccount, ether(100))
                .initialBalance(retailerAccount, ether(100))
        );
        // add contracts to publish
        EthAddress contractAddress = ethereum.publishContract(soliditySource, "Insurechain", mainAccount).get();
        insureChainContractFromAdmin = ethereum.createContractProxy(soliditySource, "Insurechain", contractAddress, mainAccount, Insurechain.class);
        insureChainContractFromInsurance = ethereum.createContractProxy(soliditySource, "Insurechain", contractAddress, insuranceAccount, Insurechain.class);
        insureChainContractFromRetailer = ethereum.createContractProxy(soliditySource, "Insurechain", contractAddress, retailerAccount, Insurechain.class);
    }

    @Test
    public void contractTest() throws ExecutionException, InterruptedException, IOException {
        assertEquals(RegistrationState.Undefined, insureChainContractFromAdmin.getRequestState(retailerAccount, insuranceAccount));
        assertEquals(mainAccount.getAddress(), insureChainContractFromAdmin.getOwner());

        /*first register and approve an insurance*/
        insureChainContractFromInsurance.createInsurance("Zurich").get();

        /*now check that the retailer can not request membership of an unapproved insurance*/
        try {
            insureChainContractFromRetailer.requestRegistration("a company name", insuranceAccount).get();
            fail("the call should throw an exception");
        } catch (ExecutionException e) {
            Assert.assertEquals(EthereumApiException.class, e.getCause().getClass());
        }

        /*the owner approves the insurance creation*/
        insureChainContractFromAdmin.setInsuranceState(insuranceAccount, InsuranceStatus.Active.ordinal()).get();

        /*the registration request should pass now*/
        insureChainContractFromRetailer.requestRegistration("a company name", insuranceAccount).get();
        /*there is one retailer in the list now*/
        Assert.assertEquals(1L, insureChainContractFromRetailer.retailerCount().longValue());
        /*and the state of the request is pending approval*/
        assertEquals(RegistrationState.Requested, insureChainContractFromAdmin.getRequestState(retailerAccount, insuranceAccount));

        /*the insurer approves the registration request*/
        insureChainContractFromInsurance.setRequestState(retailerAccount, RegistrationState.Accepted.ordinal()).get();
        assertEquals(RegistrationState.Accepted, insureChainContractFromAdmin.getRequestState(retailerAccount, insuranceAccount));
    }
}