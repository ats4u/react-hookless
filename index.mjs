import { useState, useRef, createContext, useContext } from "react";

function useRerender() {
  const [, setState] = useState(true);
  function rerender() {
    setState((e) => !e);
  }
  return rerender;
}

function usePersistentObject(factory, rerender) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = factory(rerender);
    ref.current.rerender = rerender;
  }
  return ref.current;
}

function definePersistentObject(ObjectConsumer, objectFactory) {
  const context = createContext();
  function ObjectProvider(props) {
    const rerender = useRerender();
    const persistentObject = usePersistentObject(objectFactory, rerender);
    return (
      <context.Provider value={persistentObject}>
        <ObjectConsumer />
      </context.Provider>
    );
  }
  function useObject() {
    return useContext(context);
  }
  return [ObjectProvider, useObject];
}

export function defineModelView(AppView, modelFactory) {
  return definePersistentObject(AppView, modelFactory);
}

