import ApiService from './ApiService';
/* TreeService: helper for listing, creating and resolving trees.
Methods return normalized shapes and are used by both editor and navigator flows.
Notably `getTree(erc)` resolves an external reference code to the internal id which is then used by node/edge services. */
class TreeService {

    constructor(baseURL, treeObjectName, treeLabel) {
        this.baseURL = baseURL;
        this.treeObjectName = treeObjectName;
        this.treeLabel = treeLabel;
    }

    // getTrees: list available trees with their id and label
    getTrees() {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/?fields=id%2C" + this.treeLabel, "GET").then(data => {
            return data.items.map(item => ({
                id: item.id,
                treeLabel: item[this.treeLabel]
            }));
        });

    }

    // getTree: resolve a tree by external reference code (ERC) and return the underlying API response (usually contains the id)
    getTree(erc) {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/by-external-reference-code/" + erc + "/?fields=id", "GET").then(data => {
            return data;
        });

    }

    // createTree: convenience for creating a new tree object
    createTree(name) {

        const body = {};
        body[this.treeLabel] = name;

        return ApiService.makeCall(this.baseURL + this.treeObjectName, "POST", body).then(data => {
            return data.id;
        });

    }    

    // deleteTree: delete by id and return the deleted id
    deleteTree(treeId) {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId, "DELETE").then(data => {
            return treeId;
        });

    } 

}

export default TreeService;
