const NumberTicker = (props: any) => {
  const rn = Date.now();

  function handleChange(value: number) {
    if (isNaN(value)) {
      props.setQuantity(0);
      return null;
    }
    if (value < 1) {
      props.setQuantity(1);
      return null;
    }
    props.setQuantity(value);
  }

  if (props.endDate < (rn / 1000) || props.maxTokens?.toString() === props.tokenCount) {
    return null;
  }

  return (
    <div className="flex items-center gap-5">
      <button
        className="font-500 w-10 h-10 rounded-full bg-[#FAFAFA] border"
        onClick={() => handleChange(props.quantity - 1)}
      >-</button>
      <input max={5} className="w-full font-semibold flex-1 text-center text-gray-800" min="1" type="number" onChange={(e) => handleChange(Number(e.target.value))} value={props.quantity} />
      <button
        className="font-500 w-10 h-10 rounded-full bg-[#FAFAFA] border"
        onClick={() => handleChange(props.quantity + 1)}
      >+</button>
    </div>
  )
}

export default NumberTicker;
