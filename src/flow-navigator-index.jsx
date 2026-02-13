import React from 'react';
import { createRoot } from 'react-dom/client';

import FlowNavigator from './flow-navigator/FlowNavigator';

import TreeService from './services/TreeService';
import NodeService from './services/NodeService';
import EdgeService from './services/EdgeService';
import AccordionService from './services/AccordionService';

class FlowNavigatorWebComponent extends HTMLElement {
	baseURL = 'http://localhost:8080/o/c/';

	constructor() {
		super();
		this._rootInstance = null;
		this._mountObserver = null;
	}

	connectedCallback() {
		// Show fragment-provided skeleton until React actually mounts.
		this.setAttribute('data-react-mounted', 'false');

		if (!this.querySelector('.react-root')) {
			const reactRoot = document.createElement('div');
			reactRoot.className = 'react-root';
			this.appendChild(reactRoot);
		}

		this._renderReact();
	}

	disconnectedCallback() {
		if (this._mountObserver) {
			this._mountObserver.disconnect();
			this._mountObserver = null;
		}
		this.removeAttribute('data-react-mounted');

		if (this._rootInstance) {
			this._rootInstance.unmount();
			this._rootInstance = null;
		}
	}

	_waitForReactMount(reactRoot) {
		if (this._mountObserver) {
			return;
		}

		const markMountedIfReady = () => {
			if (reactRoot.childNodes && reactRoot.childNodes.length > 0) {
				this.setAttribute('data-react-mounted', 'true');
				if (this._mountObserver) {
					this._mountObserver.disconnect();
					this._mountObserver = null;
				}
			}
		};

		markMountedIfReady();

		this._mountObserver = new MutationObserver(() => markMountedIfReady());
		this._mountObserver.observe(reactRoot, { childList: true, subtree: true });
	}

	_renderReact() {
		const reactRoot = this.querySelector('.react-root');
		if (!reactRoot) {
			return;
		}

		this._waitForReactMount(reactRoot);

		if (!this._rootInstance) {
			this._rootInstance = createRoot(reactRoot);
		}

		const nodeEl = this.querySelector('node');
		const edgeEl = this.querySelector('edge');
		const treeEl = this.querySelector('tree');
		const accordionEl = this.querySelector('accordion');

		if (!nodeEl || !edgeEl || !treeEl || !accordionEl) {
			return;
		}

		const nodeObjectName = nodeEl.getAttribute('object-name');
		const nodeObjectNamePlural = nodeEl.getAttribute('object-name-plural');
		const nodeTitle = nodeEl.getAttribute('label');
		const nodeText = nodeEl.getAttribute('text');
		const nodeImage = nodeEl.getAttribute('image');
		const nodeRoot = nodeEl.getAttribute('root');
		const xPosition = nodeEl.getAttribute('x');
		const yPosition = nodeEl.getAttribute('y');

		const edgeObjectNamePlural = edgeEl.getAttribute('object-name-plural');
		const sourceRelationName = edgeEl.getAttribute('source-relationship');
		const targetRelationName = edgeEl.getAttribute('target-relationship');
		const edgeLabel = edgeEl.getAttribute('label');

		const treeObjectName = treeEl.getAttribute('object-name');
		const treeObjectNamePlural = treeEl.getAttribute('object-name-plural');
		const treeNodesRelationshipName = treeEl.getAttribute('node-belongs-relationship');
		const treeEdgesRelationshipName = treeEl.getAttribute('edge-belongs-relationship');
		const treeLabel = treeEl.getAttribute('label');

		const accordionObjectName = accordionEl.getAttribute('object-name');
		const accordionObjectNamePlural = accordionEl.getAttribute('object-name-plural');
		const nodeAccordionsId = accordionEl.getAttribute('node-accordions-id');
		const accordionHeading = accordionEl.getAttribute('heading');
		const accordionContent = accordionEl.getAttribute('content');

		const sourceRelationId = 'r_' + sourceRelationName + '_c_' + nodeObjectName + 'Id';
		const targetRelationId = 'r_' + targetRelationName + '_c_' + nodeObjectName + 'Id';

		const treeNodesRelationshipId = 'r_' + treeNodesRelationshipName + '_c_' + treeObjectName + 'Id';
		const treeEdgesRelationshipId = 'r_' + treeEdgesRelationshipName + '_c_' + treeObjectName + 'Id';

		const treeERC = this.getAttribute('tree-erc');
		const portalBaseUrl = this.getAttribute('portal-base-url');

		this._rootInstance.render(
			<FlowNavigator
				treeERC={treeERC}
				treeService={new TreeService(portalBaseUrl, treeObjectNamePlural, treeLabel)}
				nodeService={
					new NodeService(
						portalBaseUrl,
						nodeObjectNamePlural,
						treeObjectNamePlural,
						treeNodesRelationshipName,
						treeNodesRelationshipId,
						nodeTitle,
						nodeText,
						nodeImage,
						nodeRoot,
						xPosition,
						yPosition
					)
				}
				edgeService={
					new EdgeService(
						portalBaseUrl,
						edgeObjectNamePlural,
						treeObjectNamePlural,
						treeEdgesRelationshipName,
						treeEdgesRelationshipId,
						sourceRelationId,
						targetRelationId,
						edgeLabel
					)
				}
				accordionService={
					new AccordionService(
						portalBaseUrl,
						nodeObjectNamePlural,
						accordionObjectName,
						accordionObjectNamePlural,
						nodeAccordionsId,
						accordionHeading,
						accordionContent
					)
				}
			/>
		);
	}
}

const FLOW_NAVIGATOR_ELEMENT_ID = 'flow-navigator';

if (!customElements.get(FLOW_NAVIGATOR_ELEMENT_ID)) {
	customElements.define(FLOW_NAVIGATOR_ELEMENT_ID, FlowNavigatorWebComponent);
}
