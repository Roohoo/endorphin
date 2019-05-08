import Entity from './Entity';
import ElementEntity from './ElementEntity';
import CompileState from '../lib/CompileState';
import { toObjectLiteral } from '../lib/utils';

export default class ComponentMountEntity extends Entity {
    constructor(readonly element: ElementEntity, state: CompileState) {
        super('', state);
        this.setMount(() => {
            const staticProps = element.getStaticProps();
            const staticPropsArg = staticProps.size
                ? toObjectLiteral(staticProps, state.indent, 1) : null;
            return state.runtime('mountComponent', [element.getSymbol(), staticPropsArg]);
        });
        this.setUpdate(() => state.runtime('updateComponent', [element.getSymbol()]));
        this.setUnmount(() => element.unmount('unmountComponent'));
    }
}
