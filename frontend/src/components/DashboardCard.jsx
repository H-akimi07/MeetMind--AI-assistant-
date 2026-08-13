function DashboardCard({ title, value, icon }) {
  return (
    <div className="min-h-45 rounded-[25px] border border-[rgba(212,175,55,0.25)] bg-[#111111] p-7.5 transition duration-300 ease-in-out hover:-translate-y-2 hover:border-[#d4af37] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]">
      <div className="text-[30px]">{icon}</div>

      <h3 className="mt-5 text-[#aaaaaa]">{title}</h3>

      <h2 className="mt-2.5 text-[42px] text-white">{value}</h2>
    </div>
  );
}

export default DashboardCard;
