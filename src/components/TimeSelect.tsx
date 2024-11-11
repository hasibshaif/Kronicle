export default function TimeSelect({ 
  step = 30,
  value,
  onChange, 
  }:{ 
  step: 30 | 60;
  value: string;
  onChange: (val:string) => void,
  }) 
  {
    const times = ['00:00'];
    for (let i = 1; i < 24; i++) {
      times.push((i < 10 ? '0' + i : i) + ':00');
      if (step === 30) {
        times.push((i < 10 ? '0' + i : i) + ':30');
      }
    }
  
    return (
      <select
        className="w-full px-2 py-1 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {times.map((time, index) => (
          <option
            key={index}
            value={time}
            className="bg-gray-900 text-white"
          >
            {time}
          </option>
        ))}
      </select>
    );
  }
  