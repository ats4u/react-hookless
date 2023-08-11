import * as React from "react";

function useRerender() {
  const [, setState] = React.useState(true);
  function rerender() {
    setState((e) => !e);
  }
  return rerender;
}
function usePersistentObject(factory, rerender) {
  const ref = React.useRef(null);
  if (ref.current === null) {
    ref.current = factory(rerender);
    ref.current.rerender = rerender;
  }
  return ref.current;
}
function definePersistentObject(ObjectConsumer, objectFactory) {
  const context = React.createContext();
  function ObjectProvider(props) {
    const rerender = useRerender();
    const persistentObject = usePersistentObject(objectFactory, rerender);
    // return (
    //   <context.Provider value={persistentObject}>
    //     <ObjectConsumer />
    //   </context.Provider>
    // );
    return React.createElement( context.Provider, {
      value : persistentObject
    }, React.createElement(ObjectConsumer, null));
  }
  function useObject() {
    return React.useContext(context);
  }
  return [ObjectProvider, useObject];
}
export function defineModelView(AppView, modelFactory) {
  return definePersistentObject(AppView, modelFactory);
}
