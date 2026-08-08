import CheckCircleIcon from "@/components/Icons/CheckCircleIcon";

const PROMO_FEATURES = [
    "Lộ trình cá nhân hoá theo mục tiêu học tập",
    "Chấm Writing & Speaking chi tiết từ giáo viên",
    "Theo dõi tiến độ từng kỹ năng theo từng tuần",
]; 

export default function AuthLayout({ children } : { children : React.ReactNode }) {

    return (
        <div className="flex-1 flex items-center justify-center bg-surface">
            <div className="flex items-center justify-center gap-18 w-full max-w-6xl p-7.5">

                {/* Cột trái — promo panel, chỉ hiện khi màn hình đủ rộng */}
                <div className="flex-1 max-w-lg">
                    <p className="inline-flex items-center rounded-full bg-accent-bg px-3 py-1.25 text-xs font-bold text-accent-active mb-4.5">
                        IELTS BY PHANH
                    </p>
                    <h2 className="font-serif font-bold text-[clamp(28px,3.4vw,38px)] leading-[1.18] text-fg mb-4">
                        Học IELTS có lộ trình,<br />tiến bộ đo được từng tuần.
                    </h2>
                    <p className="text-muted leading-[1.6] max-w-[46ch] mb-6.5">
                        Một tài khoản duy nhất cho cả giáo viên và học viên — quản lý lớp, giao bài, luyện đề và theo dõi tiến độ ở cùng một nơi.
                    </p>
                    <ul className="flex flex-col gap-3.5">
                        {PROMO_FEATURES.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-[14px] text-fg">
                                <CheckCircleIcon className="text-accent" width={18} height={18}/>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột phải — card chứa children (form) */}
                <div className="w-full max-w-lg">
                    <div className="rounded-2xl border border-border bg-bg p-8 pb-7 shadow-[0_1px_2px_rgba(17,17,17,.04),0_12px_32px_-16px_rgba(17,17,17,.08)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}