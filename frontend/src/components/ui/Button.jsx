function Button({ text, onClick, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
            {text}
        </button>
    );
}

export default Button;