import React from 'react';
import { createRoot } from 'react-dom/client';

import 'ckeditor5/ckeditor5.css';

import FlowEditor from './flow-editor/FlowEditor';

import TreeService from './services/TreeService';
import NodeService from './services/NodeService';
import EdgeService from './services/EdgeService';
import AccordionService from './services/AccordionService';

import { ReactFlowProvider } from '@xyflow/react';

class FlowEditorWebComponent extends HTMLElement {
	baseURL = 'http://localhost:8080/o/c/';

	constructor() {
		super();
		this._rootInstance = null;
	}

	connectedCallback() {
		if (!this.querySelector('.react-root')) {
			const reactRoot = document.createElement('div');
			reactRoot.className = 'react-root';
			this.appendChild(reactRoot);
		}

		this._renderReact();
	}

	disconnectedCallback() {
		if (this._rootInstance) {
			this._rootInstance.unmount();
			this._rootInstance = null;
		}
	}

	_renderReact() {
		const reactRoot = this.querySelector('.react-root');
		if (!reactRoot) {
			return;
		}

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

		const portalBaseUrl = this.getAttribute('portal-base-url');

		this._rootInstance.render(
			<ReactFlowProvider>
				<FlowEditor
					treeId={null}
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
			</ReactFlowProvider>
		);
	}
}

const FLOW_EDITOR_ELEMENT_ID = 'flow-editor';

if (!customElements.get(FLOW_EDITOR_ELEMENT_ID)) {
	customElements.define(FLOW_EDITOR_ELEMENT_ID, FlowEditorWebComponent);
}
