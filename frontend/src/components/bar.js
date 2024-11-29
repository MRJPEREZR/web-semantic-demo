import './bar.css';


function Bar() {
   return (
    <div className="temperature-bar">
    <div className="temperature-range">
      <span className="temperature-value">minV</span>
      <span className="temperature-value">maxV</span>
    </div>
    <div className="temperature-bar-container">
      <div className="temperature-bar-fill" style={{ width: '40%' }}></div> {/* put mean value in percentage*/}
    </div>
  </div>
  );
}

export default Bar;



