import './bar.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';


function Bar({minV,maxV,mean}) {
  const barWidth = ((mean - minV) / (maxV - minV)) * 100;

   return (
    <div className="temperature-bar">
      <div className="temperature-range">
        <span className="temperature-value-min" style={{ color: 'blue' }}>
          {minV} <FaArrowDown style={{ color: 'blue', fontSize: '20px', verticalAlign: 'middle',marginBottom:10 }} />
        </span>
        <span className="temperature-value-max" style={{ color: 'red' }}>
          {maxV} <FaArrowUp style={{ color: 'red', fontSize: '20px', verticalAlign: 'middle',marginBottom:10  }} />
        </span>
      </div>
      <div className="temperature-bar-container">
        <div className="temperature-bar-fill" style={{ width: `${barWidth}%` }}></div>
      </div>
    </div>

  );
}

export default Bar;



