const CustomRender = (props) => {
  return (
    props.render(props.scope) || (
      <span className="aile-table-item__placeholder">Empty</span>
    )
  );
};

export default CustomRender;
