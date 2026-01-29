import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

/* Hook: useNodeAccordions
Purpose: fetch accordion data for a specific node.
Fetches from the endpoint: {baseURL}/nodes/{nodeId}/accordion
Returns: { accordions, loading, error } */

export const useNodeAccordions = (baseURL, nodeId) => {
  const [accordions, setAccordions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nodeId || !baseURL) {
      setAccordions([]);
      return;
    }

    setLoading(true);
    setError(null);

    const url = `${baseURL}nodes/${nodeId}/accordion`;
    console.log(`Fetching accordions from URL: ${url}`);
    
    ApiService.makeCall(url, 'GET')
      .then(data => {
        // The endpoint should return accordion data; check if it's an array or object
        let accordionList = [];
        
        if (Array.isArray(data)) {
          accordionList = data;
        } else if (data && data.items && Array.isArray(data.items)) {
          accordionList = data.items;
        } else if (data) {
          // Single accordion object
          accordionList = [data];
        }

        const normalizedAccordions = accordionList.map(item => ({
          title: item.heading || item.title || '',
          content: item.content || item.body || ''
        }));

        console.log(`Loaded ${normalizedAccordions.length} accordions for node ${nodeId}:`, normalizedAccordions);
        setAccordions(normalizedAccordions);
        setLoading(false);
      })
      .catch(err => {
        console.log(`No accordions found for node ${nodeId}:`, err.message);
        setAccordions([]);
        setError(err);
        setLoading(false);
      });
  }, [nodeId, baseURL]);

  return { accordions, loading, error };
};
