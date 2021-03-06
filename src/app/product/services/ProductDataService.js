/**
 * Objects DataService
 * Uses embedded, hard-coded data model; acts asynchronously to simulate
 * remote data service call(s).
 *
 * @returns {{loadAll: Function}}
 * @constructor
 */
function ProductDataService($q) {
    var users = [
        {
            manufacturer: 'Samsung',
            name: 'Galaxy Edge 7',
            productType: 'Phone',
            serial: '12345677890',
            avatar: 'face',
            description: 'It\'s a phone'
        },
        {
            manufacturer: 'Samsung',
            name: 'Galaxy Edge 8',
            productType: 'Phone',
            serial: '12345677810',
            avatar: 'face',
            description: 'It\'s a phone'
        },
        {
            manufacturer: 'Samsung',
            name: 'Galaxy Edge 9',
            productType: 'Phone',
            serial: '12345677811',
            avatar: 'face',
            description: 'It\'s a phone'
        },
        {
            manufacturer: 'Samsung',
            name: 'Galaxy Edge 10',
            productType: 'Phone',
            serial: '12345677812',
            avatar: 'face',
            description: 'It\'s a phone'
        },
        {
            manufacturer: 'Samsung',
            name: 'Galaxy Edge 11',
            productType: 'Phone',
            serial: '12345677813',
            avatar: 'face',
            description: 'It\'s a phone'
        }
    ];

    // Promise-based API
    return {
        loadAllObjects: function () {
            // Simulate async nature of real remote calls
            return $q.when(users);
        }
    };
}

export default ['$q', ProductDataService];

