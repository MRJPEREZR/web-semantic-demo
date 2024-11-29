import './bar.css';


function Bar({minV,maxV,mean}) {
  const barWidth = ((mean - minV) / (maxV - minV)) * 100;

   return (
    <div className="temperature-bar">
    <div className="temperature-range">
      <span className="temperature-value-min" style={{color:'red'}}>{minV}</span>
      <span className="temperature-value-max" style={{color:'blue'}}>{maxV}</span>
    </div>
    <div className="temperature-bar-container">
      <div className="temperature-bar-fill" style={{width: `${barWidth}%`, }}></div> {/* put mean value in percentage*/}
    </div>
  </div>
  );
}

export default Bar;



