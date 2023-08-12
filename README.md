 react-hookless
==================

 Features
----------
**react-hookless** is a new state management library. This is a quite unusual
and yet efficient usage of React.js' hooks.

- No framework is required
- No more infinite rendering loop
- No more stale closure problem
- No more batch update problem
- No more fussy tricks to manage rendering triggers indirect way
- Just call rerender() whenever you want to rerender

In **react-hookless**, you can create a single object without restrictions
which React.js applications have to follow and the object can be accessed from
anywhere in your React.js application. The object survives re-renderings so
that you do not have to care for its life-cycle. The object persists until the
browser window closes.

In **react-hookless**, the object is called **a model**.  And call `rerender()`
method when there are any components to be updated because the components are
built upon any fields of the model object; at this point, the React components
can be called as **views**.

[CodeSandbox](https://hx4kvd.csb.app/)

In this way, you can build your React application as a traditional pure
JavaScritp object and you can even manually control when React renders the
current Virtual DOM tree into HTML DOM tree.

 How to Use
-------------

Define your business logic as a simple pure JavaScript object as:

`AppModel.js`

```javascript
export class AppModel {
  fooValue = 1;
  barValue = 1;
  foo() {
    this.fooValue++;
    this.rerender();
  }
  bar() {
    this.barValue--;
    this.rerender();
  }
  dependency = 0;
}
```

Then bind the model object to your main component; in this example, your main
component is named as `AppView`.

`App.js`

```javascript
import { defineModelView } from "react-hookless";
import { AppView         } from "./AppView.js";
import { AppModel        } from "./AppModel.js";
export const [App, useAppModel] = defineModelView(
  AppView,
  () => new AppModel()
);
```

Then build your main component. Your object can be accessed with `useAppModel()` hook.

This is actually the only hook you have to use in this framework; other hooks
are hidden to the hook.

`AppView.js`

```javascript
import { useAppModel } from "./App.js";

export function AppView() {
  const appModel = useAppModel();
  return (
    <div>
      <h1>An Unusual and Yet Very Effective Usage of React.js</h1>
      <div onClick={() => appModel.foo()}>{appModel.fooValue}</div>
      <br />
      <div onClick={() => appModel.bar()}>{appModel.barValue}</div>
    </div>
  );
}
```

In case you worry about the life cycle of your object, I will mention that the
object you specified to `defineModelView()` function survives
re-renderings.


Then render the application object.

```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

 The Principle of React-Hookless
----------------------------------

The module `react-hookless` is so small that the source code can be exhibited
in the `README.md` of itsown.

The specified object becomes persistent by using `useRef()` hook and
the instance is shared by `useContext()` hook.

```javascript
import * as React from "react";

export function useRerender() {
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
```

 The API Reference
---------------------
### `defineModelView()` ###
```javascript
import { defineModelView } from "react-hookless";
export const [App, useAppModel] = defineModelView( AppView, appModelFactory );
```

- Parameters
    - `AppView` : Specifing the view component
    - `appModelFactory` : A function which creates the model object
- Return Values
    - `App` : The generated main component which is a view bound to the single
      model object.
    - `useAppModel` : The generated hook funcion which is to retrieve the
      current model object from the view.

### `useRerender()` ###
```javascript
function SomeComponent(props) {
  const rerender = useRerender();
  const ref = React.useRef({
    status: "ready"
  });

  React.useEffect(() => {
    if (ref.current.status === "ready") {
      ref.current.status = "started";
      rerender();
      setTimeout(() => {
        ref.current.status = "done";
        ref.current.value = 42;
        // Call `rerender()` in case of the timeout was occured while it is
        // unmounted. If the timeout had been occured before this component was
        // mounted, rerender() would not be necessary since it would be already
        // displayed.
        rerender();
      }, 5000);
    }
    return ()=>{
      // intentionally sabotarge to clear the timer
    };
  }, []);

  return (
    <>
      <h1>{ref.current.status}</h1>
      {ref.current.status === "done" ? <h1>{ref.current.value}</h1> : null}
    </>
  );
}
```

Here is my two cents; just stick to `useRef()`/`useMemo()` to manage the state
of your application and whenever you want to update your components, call
`rerender()`. Just do not let React detect when to rerender.  This effectively
lets your application survive under the error detection of React which enforces
every rendering to repeat twice, especially if your application needs to start
initialization by `useEffect()` hook; you have to be very clever to avoid the
infnite rendering loop.


## Conclusion  ##

I am not sure this is an appropriate usage React.js nor I even don't think this
is a correct usage of React.js since this usage is a kind of an attempt of
denial of the React.js's mechanism for the automatic update detection.

But in this way, I believe, the number of issues which you often encounter when
you build a comparably larger application can be easily avoided.

I am worrying that nobody understand the meaning and the effectiveness of this
module because I even think this module is very weird; but it works.


Additionally, I am from Japan; my English ability is quite limited. Please
excuse my obscured English and I hope my English is good enough for everyone to
understand my idea.

Thank you very much and see you soon.


## History ##

- v1.0.0 Released
- v1.0.1 Updated README.md
- v1.0.2 Updated README.md (Tue, 08 Aug 2023 10:41:08 +0900)
- v1.0.3 Updated README.md (Tue, 08 Aug 2023 10:49:17 +0900)
- v1.0.4 Updated README.md (Tue, 08 Aug 2023 16:24:05 +0900)
- v1.0.5 Updated README.md (Wed, 09 Aug 2023 17:23:53 +0900)
- v1.0.6 Updated README.md (Wed, 09 Aug 2023 20:30:01 +0900)
- v1.0.7 Removed JSX syntax (Fri, 11 Aug 2023 10:56:13 +0900)
- v1.0.8 Exported `useRerender()` (Sat, 12 Aug 2023 15:57:48 +0900)


