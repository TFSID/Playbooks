const LayoutWithTittle = ({ title, desc, children }) => {
  return (
    <div>
      <div className="neon-box-glow overflow-hidden container rounded-lg">
        <div className="bg-background/80 backdrop-blur-sm">
          <div className="p-4 border-b border-primary/20">
            <h3 className="text-xl font-semibold neon-heading">{title}</h3>
            <p className="mt-2 neon-text text-[13px]">{desc}</p>
          </div>
          <div className="card-body ">
            <div className="py-5 space-y-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LayoutWithTittle;
