import { MountBlock, UpdateBlock } from './types';
import { BaseBlock, injectBlock, run, emptyBlockContent, disposeBlock, getSlotContext } from './injector';
import { Component } from './component';
import { isolateElement } from './dom';
import { getScope } from './scope';
import { runHook } from './hooks';

export interface SlotContext {
	name: string;
	element: HTMLElement;
	isDefault: boolean;
	defaultContent: SlotBlock | null;
}

export interface SlotBlock extends BaseBlock<SlotBlock> {
	fn: MountBlock;
	update: UpdateBlock | void;
}

/**
 * Creates slot element
 */
export function createSlot(host: Component, name: string, cssScope?: string): HTMLElement {
	return isolateElement(getSlotContext(host.componentModel.input, name).element, cssScope);
}

/**
 * Mounts slot context
 */
export function mountSlot(host: Component, name: string, defaultContent?: MountBlock): SlotContext {
	const injector = host.componentModel.input;
	const ctx = getSlotContext(injector, name);
	if (defaultContent) {
		// Add block with default slot content
		ctx.defaultContent = injectBlock<SlotBlock>(injector, {
			host,
			injector,
			scope: getScope(host),
			dispose: null,
			fn: defaultContent,
			update: undefined
		});

		if (isEmpty(ctx)) {
			// No incoming content, mount default content
			renderDefaultContent(ctx);
		} else {
			setSlotted(ctx, true);
		}
	}

	return ctx;
}

/**
 * Handles possible update of incoming data
 */
export function updateIncomingSlot(host: Component, name: string, updated: number) {
	const ctx = getSlotContext(host.componentModel.input, name);

	if (updated) {
		// Incoming content was updated but there’s default content mounted
		if (ctx.isDefault) {
			emptyBlockContent(ctx.defaultContent!);
			setSlotted(ctx, true);
		}

		// Notify about updated slot content
		runHook(host, 'didSlotUpdate', name, ctx.element);
	}

	if (!ctx.isDefault && ctx.defaultContent && isEmpty(ctx)) {
		// If slot content is empty, ensure default content is rendered
		renderDefaultContent(ctx);
	}
}

/**
 * Updates default slot content only if it was already rendered
 */
export function updateDefaultSlot(ctx: SlotContext) {
	if (ctx.isDefault) {
		const block = ctx.defaultContent!;
		if (block.update) {
			run(block, block.update, block.scope);
		}
	}
}

/**
 * Unmounts default content of given slot context
 */
export function unmountSlot(ctx: SlotContext) {
	if (ctx.defaultContent) {
		disposeBlock(ctx.defaultContent);
		setSlotted(ctx, false);
		ctx.isDefault = false;
		ctx.defaultContent = null;
	}
}

/**
 * Renders default slot content
 */
function renderDefaultContent(ctx: SlotContext) {
	const block = ctx.defaultContent!;
	block.update = run(block, block.fn, block.scope);
	setSlotted(ctx, false);
}

/**
 * Check if given slot is empty
 */
function isEmpty(ctx: SlotContext): boolean {
	// TODO better check for input content?
	return !ctx.element.childNodes.length;
}

/**
 * Toggles slotted state in slot container
 */
function setSlotted(ctx: SlotContext, slotted: boolean) {
	ctx.isDefault = !slotted;
	slotted ? ctx.element.setAttribute('slotted', '') : ctx.element.removeAttribute('slotted');
}
