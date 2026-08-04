import "./Button.css";

function Button({
  children,
  onClick,
  type = "button",
  variant = "gold",
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;