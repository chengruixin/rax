type EffectFn = {
    (): void;
    referencedDepCollections: DepCollection[];
    options: {
        scheduler?: (fn: EffectFn) => void;
    };
};
type DepCollection = Set<EffectFn>;
type ObjectKey = string | symbol;
const DEP_BUCKET = new WeakMap<Object, Map<ObjectKey, DepCollection>>();
var currActiveEffectFn: EffectFn;
var effectFnStack: EffectFn[] = [];

const track = (target: Object, key: ObjectKey) => {
    if (!DEP_BUCKET.has(target)) {
        DEP_BUCKET.set(target, new Map<ObjectKey, DepCollection>());
    }

    if (!DEP_BUCKET.get(target)?.has(key)) {
        DEP_BUCKET.get(target)?.set(key, new Set<EffectFn>());
    }

    if (currActiveEffectFn) {
        const depCollection = DEP_BUCKET.get(target)?.get(key);
        depCollection.add(currActiveEffectFn);
        currActiveEffectFn.referencedDepCollections.push(depCollection);
    }
};

const trigger = (target: Object, key: ObjectKey) => {
    if (!DEP_BUCKET.has(target) || !DEP_BUCKET.get(target)?.has(key)) {
        return;
    }
    const effectSet = DEP_BUCKET.get(target)?.get(key) ?? new Set();
    const effectArr = Array.from(effectSet);
    for (const effect of effectArr) {
        if (effect === currActiveEffectFn) {
            continue;
        }

        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        } else {
            effect();
        }
    }
};



const makeReactive = (obj: Object, isShallow = false) => {
    return new Proxy(obj, {
        get(target, key, receiver) {

            const getResult = Reflect.get(target, key, receiver);

            track(target, key);

            if (!isShallow && typeof getResult === 'object' && getResult !== null) {
                return makeReactive(getResult)
            }

            return getResult;
        },
        set(target, key, newVal, receiver) {
            const res = Reflect.set(target, key, newVal, receiver);
            trigger(target, key);
            return res
        },
    });
};

const resetDependencies = (effectFn: EffectFn) => {
    const { referencedDepCollections } = effectFn;
    for (const depCollection of referencedDepCollections) {
        depCollection.delete(effectFn);
    }

    effectFn.referencedDepCollections.length = 0;
};

const effect = (fn: () => void, options?) => {
    const effectFn: EffectFn = () => {
        resetDependencies(effectFn)
        currActiveEffectFn = effectFn
        effectFnStack.push(effectFn);

        fn()
        effectFnStack.pop();
        currActiveEffectFn = effectFnStack[effectFnStack.length - 1];
    }

    // effectFn initializtion
    effectFn.referencedDepCollections = [];
    effectFn.options = options;
    effectFn()
};


const ref = () => {

};

const reactive = () => {

}

const shallowReactive = () => {

}

const watch = () => {

}

const computed = () => {

}

console.log(1)