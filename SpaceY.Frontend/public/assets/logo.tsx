const MocNgheLogo = () => (
    <svg
        className="w-10 h-10"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Vòng tròn nền */}
        <circle cx="50" cy="50" r="48" fill="#F5F0E6" stroke="#2F3D2A" strokeWidth="4" />

        {/* Vân gỗ đồng tâm mô phỏng gỗ cắt ngang */}
        <circle cx="50" cy="50" r="20" stroke="#2F3D2A" strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="50" r="10" stroke="#2F3D2A" strokeWidth="1" fill="none" />
        <circle cx="50" cy="50" r="4" fill="#2F3D2A" />

        {/* Lá cây bên dưới biểu tượng gỗ */}
        <path
            d="M30 72 C35 68, 65 68, 70 72"
            stroke="#2F3D2A"
            strokeWidth="2"
            fill="none"
        />
        <circle cx="30" cy="72" r="1.5" fill="#2F3D2A" />
        <circle cx="70" cy="72" r="1.5" fill="#2F3D2A" />
    </svg>
);

export default MocNgheLogo;
  