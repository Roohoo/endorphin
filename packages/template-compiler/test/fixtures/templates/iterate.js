import { createInjector, elem, elemWithText, get, insert, mountBlock, mountIterator, text, unmountBlock, unmountIterator, updateBlock, updateIterator } from "endorphin";

function forSelect$0(host) {
	return host.props.items;
}

function ifBody$1(host, injector) {
	insert(injector, elemWithText("strong", "*"));
}

function ifEntry$1(host, scope) {
	if (get(scope.value, "marked")) {
		return ifBody$1;
	}
}

function forContent$0(host, injector, scope) {
	const li$0 = insert(injector, elem("li"));
	const inj$1 = createInjector(li$0);
	insert(inj$1, text("\n                    item\n                    "));
	scope.if$1 = mountBlock(host, inj$1, ifEntry$1);
	return forContent$0Update;
}

forContent$0.dispose = forContent$0Unmount;

function forContent$0Update(host, scope) {
	updateBlock(scope.if$1);
}

function forContent$0Unmount(scope) {
	scope.if$1 = unmountBlock(scope.if$1);
}

function ifBody$0(host, injector, scope) {
	insert(injector, elemWithText("p", "will iterate"));
	const ul$0 = insert(injector, elem("ul"));
	const inj$2 = createInjector(ul$0);
	scope.for$0 = mountIterator(host, inj$2, forSelect$0, forContent$0);
	return ifBody$0Update;
}

ifBody$0.dispose = ifBody$0Unmount;

function ifBody$0Update(host, scope) {
	updateIterator(scope.for$0);
}

function ifBody$0Unmount(scope) {
	scope.for$0 = unmountIterator(scope.for$0);
}

function ifEntry$0(host) {
	if (host.props.items) {
		return ifBody$0;
	}
}

export default function template$0(host, scope) {
	const target$0 = host.componentView;
	const inj$0 = createInjector(target$0);
	insert(inj$0, elemWithText("h1", "Hello world"));
	scope.if$0 = mountBlock(host, inj$0, ifEntry$0);
	return template$0Update;
}

template$0.dispose = template$0Unmount;

function template$0Update(host, scope) {
	updateBlock(scope.if$0);
}

function template$0Unmount(scope) {
	scope.if$0 = unmountBlock(scope.if$0);
}