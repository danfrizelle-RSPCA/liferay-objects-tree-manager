import ApiService from './ApiService';

/* AccordionService: encapsulates CRUD operations for accordion objects.

Constructor takes a set of field/object names so the same class can be reused for different Liferay object schemas.
Example usage (from `src/index.jsx`):
new AccordionService(portalBaseUrl, accordionObjectNamePlural, nodeObjectNamePlural, nodeAccordionsRelationshipName, nodeAccordionsRelationshipId, accordionHeading, accordionContent) */
class AccordionService {

    //localhost:8080/o/c/nodes/42600/accordions/?pageSize=500&fields=id,heading,content
    constructor(baseURL, accordionObjectName, nodeObjectName, nodeAccordionsRelationshipName, nodeAccordionsRelationshipId, accordionHeading, accordionContent) {
        this.baseURL = baseURL;
        this.accordionObjectName = accordionObjectName;
        this.nodeObjectName = nodeObjectName;
        this.nodeAccordionsRelationshipName = nodeAccordionsRelationshipName;
        this.nodeAccordionsRelationshipId = nodeAccordionsRelationshipId;
        this.accordionRoot = 'root';
        this.accordionHeading = accordionHeading;
        this.accordionContent = accordionContent;
    }

    // getAccordions: fetch accordions for a given node id and map fields into a normalized shape used by the UI (including position fields).
    getAccordions(nodeId) {
        // Preferred node-specific endpoint: /nodes/{nodeId}/accordion
        const url = this.baseURL + this.nodeObjectName + "/" + nodeId + "/accordion";
        console.log('AccordionService.getAccordions URL:', url);
        return ApiService.makeCall(url, "GET").then(data => {
            // data might be array or object with items
            let items = [];
            if (Array.isArray(data)) items = data;
            else if (data && data.items) items = data.items;
            else if (data) items = [data];

            return items.map(item => ({
                id: item.id,
                accordionHeading: item[this.accordionHeading] || item.heading || item.title,
                accordionContent: item[this.accordionContent] || item.content || item.body
            }));
        });

    }

    createAccordion(nodeId, accordionHeading, accordionContent) {
        // POST to root /accordions endpoint with relationship field; Liferay API does not support POST to /nodes/{nodeId}/accordion
        const url = this.baseURL + this.accordionObjectName;
        const body = {
            [this.nodeAccordionsRelationshipId]: nodeId,
            [this.accordionHeading]: accordionHeading,
            [this.accordionContent]: accordionContent
        };
        console.log('AccordionService.createAccordion URL:', url, 'Body:', body);
        return ApiService.makeCall(url, "POST", body).then(data => {
            return {
                id: data.id,
                accordionHeading: data[this.accordionHeading] || data.heading || data.title,
                accordionContent: data[this.accordionContent] || data.content || data.body
            }
        });

    }

    updateAccordion(accordionId, accordionHeading, accordionContent) {
        // Use PUT on the root /accordions/{id} endpoint
        const url = this.baseURL + this.accordionObjectName + "/" + accordionId;
        const body = {
            [this.accordionHeading]: accordionHeading,
            [this.accordionContent]: accordionContent
        };
        console.log('AccordionService.updateAccordion URL:', url);
        return ApiService.makeCall(url, "PUT", body);

    }

    deleteAccordion(accordionId) {
        // Use DELETE on the root /accordions/{id} endpoint
        const url = this.baseURL + this.accordionObjectName + "/" + accordionId;
        console.log('AccordionService.deleteAccordion URL:', url);
        return ApiService.makeCall(url, "DELETE");

    }

}

export default AccordionService;