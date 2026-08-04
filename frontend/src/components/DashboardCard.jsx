import "./DashboardCard.css";


function DashboardCard({
  title,
  value,
  icon
}) {


  return (

    <div className="dashboard-card">


      <div className="card-icon">

        {icon}

      </div>


      <h3>

        {title}

      </h3>


      <h2>

        {value}

      </h2>


    </div>

  );

}


export default DashboardCard;