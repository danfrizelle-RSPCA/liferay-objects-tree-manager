import ApiService from './ApiService';

/* NodeService: encapsulates CRUD operations for node objects.

Constructor takes a set of field/object names so the same class can be reused for different Liferay object schemas.
Example usage (from `src/index.jsx`):
new NodeService(portalBaseUrl, nodeObjectNamePlural, treeObjectNamePlural, treeNodesRelationshipName, treeNodesRelationshipId, nodeTitle, nodeText, nodeImage,nodeRoot, xPosition, yPosition) */
class NodeService {

    constructor(baseURL, nodeObjectName, treeObjectName, treeNodesRelationName, treeNodesRelationId, nodeTitle, nodeText, nodeImage, nodeRoot, xPosition, yPosition, accordion1Heading, accordion1Content, accordion2Heading, accordion2Content, accordion3Heading, accordion3Content) {
        this.baseURL = baseURL;
        this.nodeObjectName = nodeObjectName;
        this.treeObjectName = treeObjectName;
        this.treeNodesRelationName = treeNodesRelationName;
        this.treeNodesRelationId = treeNodesRelationId;
        this.nodeTitle = nodeTitle;
        this.nodeText = nodeText;
        this.nodeImage = nodeImage;
        this.nodeRoot = nodeRoot;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.accordion1Heading = accordion1Heading;
        this.accordion1Content = accordion1Content;
        this.accordion2Heading = accordion2Heading;
        this.accordion2Content = accordion2Content;
        this.accordion3Heading = accordion3Heading;
        this.accordion3Content = accordion3Content;
    }

    // getStartNode: returns nodes flagged as root (start nodes) for a tree
    getStartNode(treeId) {
       
        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationName + "/?fields=id%2C" + this.nodeRoot, "GET").then(data => {
            return data.items.filter(item => {return item[this.nodeRoot]}).map(item => ({
                id: item.id
            }))
        });

    }

    // getNodes: fetch nodes for a given tree id and map fields into a normalized shape used by the UI (including position fields).
    getNodes(treeId) {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationName + "/?pageSize=500&fields=id%2C" + this.nodeRoot + "%2C"+ this.nodeTitle + "%2C" + this.nodeText + "%2C" + this.nodeImage + "%2C" + this.xPosition + "%2C" + this.yPosition + "%2C" + this.accordion1Heading + "%2C" + this.accordion1Content + "%2C" + this.accordion2Heading + "%2C" + this.accordion2Content + "%2C" + this.accordion3Heading + "%2C" + this.accordion3Content, "GET").then(data => {
            return data.items.map(item => ({
                id: item.id,
                nodeTitle: item[this.nodeTitle],
                nodeText: item[this.nodeText],
                nodeImage: item[this.nodeImage],
                nodeRoot: item[this.nodeRoot],
                xPosition: item[this.xPosition] ?? 0,
                yPosition: item[this.yPosition] ?? 0,
                accordion1Heading: item[this.accordion1Heading],
                accordion1Content: item[this.accordion1Content],
                accordion2Heading: item[this.accordion2Heading],
                accordion2Content: item[this.accordion2Content],
                accordion3Heading: item[this.accordion3Heading],
                accordion3Content: item[this.accordion3Content]
            }));
        });

    }

    createNode(treeId, nodeTitle, nodeText, nodeImage, xPosition, yPosition, accordion1Heading = '', accordion1Content = '', accordion2Heading = '', accordion2Content = '', accordion3Heading = '', accordion3Content = '') {
        
        const body = {
            [this.treeNodesRelationId]: treeId,
            [this.nodeTitle]: nodeTitle,
            [this.nodeText]: nodeText,
            [this.nodeImage]: nodeImage,
            [this.nodeRoot]: false,
            [this.xPosition]: xPosition,
            [this.yPosition]: yPosition,
            [this.accordion1Heading]: accordion1Heading,
            [this.accordion1Content]: accordion1Content,
            [this.accordion2Heading]: accordion2Heading,
            [this.accordion2Content]: accordion2Content,
            [this.accordion3Heading]: accordion3Heading,
            [this.accordion3Content]: accordion3Content
        };
        return ApiService.makeCall(this.baseURL + this.nodeObjectName, "POST", body).then(data => {
            return {
                id: data.id,
                nodeTitle: data[this.nodeTitle],
                nodeText: data[this.nodeText],
                nodeImage: data[this.nodeImage],
                xPosition: data[this.xPosition] ?? 0,
                yPosition: data[this.yPosition] ?? 0,
                accordion1Heading: data[this.accordion1Heading],
                accordion1Content: data[this.accordion1Content],
                accordion2Heading: data[this.accordion2Heading],
                accordion2Content: data[this.accordion2Content],
                accordion3Heading: data[this.accordion3Heading],
                accordion3Content: data[this.accordion3Content]
            }
        });

    }

    updateNode(nodeId, nodeTitle, nodeText, nodeImage, accordion1Heading = '', accordion1Content = '', accordion2Heading = '', accordion2Content = '', accordion3Heading = '', accordion3Content = '') {

        const body = {
            [this.nodeTitle]: nodeTitle,
            [this.nodeText]: nodeText,
            [this.nodeImage]: nodeImage,
            [this.accordion1Heading]: accordion1Heading,
            [this.accordion1Content]: accordion1Content,
            [this.accordion2Heading]: accordion2Heading,
            [this.accordion2Content]: accordion2Content,
            [this.accordion3Heading]: accordion3Heading,
            [this.accordion3Content]: accordion3Content
        };

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "PATCH", body);

    }

    setNodeAsStart(nodeId) {

        ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId + "?fields=id%2C" + this.treeNodesRelationId, "GET").then(data => {

            this.getNodes(data[this.treeNodesRelationId]).then(nodes => {

                nodes.forEach(node => {
    
                    let body = {
                        [this.nodeRoot]: node.id == nodeId
                    }
                    ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + node.id, "PATCH", body);
    
                });
    
            });
    

        });

    }

    updateNodePosition(nodeId, xPosition, yPosition) {

        const body = {
            [this.xPosition]: xPosition,
            [this.yPosition]: yPosition
        };

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "PATCH", body);

    }

    deleteNode(nodeId) {

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "DELETE");

    }

}

export default NodeService;