import { addEvent, appendChild, createInjector, elem, elemWithText, insert, mountIterator, removeEvent, unmountIterator, updateIterator } from "endorphin";

export function handleClick() {}


function setVars$0(host, scope) {
	scope.foo = 1;
}

function forSelect$0(host) {
	return host.props.items;
}

function setVars$1(host, scope) {
	scope.bar = scope.foo;
}

function onClick$0(host, evt, target, scope) {
	handleClick(scope.index, scope.foo, scope.bar, host, evt, target);
}

function forContent$0(host, injector, scope) {
	setVars$1(host, scope);
	const li$0 = insert(injector, elemWithText("li", "item"));
	scope.click$0 = addEvent(li$0, "click", onClick$0, host, scope);
	return forContent$0Update;
}

forContent$0.dispose = forContent$0Unmount;

function forContent$0Update(host, scope) {
	setVars$1(host, scope);
}

function forContent$0Unmount(scope) {
	scope.click$0 = removeEvent("click", scope.click$0);
}

function setVars$2(host, scope) {
	scope.foo = 2;
}

export default function template$0(host, scope) {
	const target$0 = host.componentView;
	const ul$0 = appendChild(target$0, elem("ul"));
	const inj$0 = createInjector(ul$0);
	setVars$0(host, scope);
	scope.for$0 = mountIterator(host, inj$0, forSelect$0, forContent$0);
	setVars$2(host, scope);
	return template$0Update;
}

template$0.dispose = template$0Unmount;

function template$0Update(host, scope) {
	setVars$0(host, scope);
	updateIterator(scope.for$0);
	setVars$2(host, scope);
}

function template$0Unmount(scope) {
	scope.for$0 = unmountIterator(scope.for$0);
}