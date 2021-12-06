import React from 'react';
import Store, { useStore } from 'statium';

export const alertsKey = 'alerts';

const closeAlert = async ({ state, set }, id) => {
  const alerts = state[alertsKey];

  const idx = alerts.findIndex(alert => alert.id === id);

  if (idx > -1) {
    alerts.splice(idx, 1);
    await set({ [alertsKey]: alerts })
  }
};

export const AlertWidget = props => {
  const { dispatch } = useStore();
  const {
    id,
    type = 'primary',
    dismissible = true,
    text,
    timeout = 5000,
  } = props;

  const cls = `alert alert-${type} ${dismissible ? 'alert-dismissible' : ''}`

  let children = [...React.Children.toArray(props.children), text];

  if (dismissible) {
    const onClick = e => {
      if (e) {
        e.preventDefault();
      }

      dispatch(closeAlert, id);
    };

    if (timeout) {
      setTimeout(onClick, timeout)
    }

    children = [...children, (
      <button key="close" type="button"
        className="close"
        aria-label="Close"
        onClick={onClick}>
        <span aria-hidden="true">&times;</span>
      </button>
    )];
  }

  return (
    <div className={cls} role="alert">
      {children}
    </div>
  );
}

export const AlertProvider = ({ children }) => (
  <Store tag="Alerts" state={{ [alertsKey]: [] }}>
    {children}
  </Store>
);

export const Alerts = () => {
  const { state: { [alertsKey]: alerts } } = useStore();

  return (
    <>
      { alerts.map(({ id, ...alert }) =>
        <AlertWidget key={id} id={id} {...alert} />)
      }
    </>
  );
};
