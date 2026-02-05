import { Link } from '@tanstack/react-router'
import Container from '@/components/shared/Container'
import SpaceSignBoard from '@/assets/svg/SpaceSignBoard'

export function NotFound({ children }: { children?: any }) {
  return (
    <Container className="h-full">
        <div className="h-full flex flex-col items-center justify-center">
            <SpaceSignBoard height={280} width={280} />
            <div className="mt-10 text-center">
                <h3 className="mb-2">Oh uh - We can't find this page!</h3>
                <p className="text-base">
                    {children || "The page you are looking for does not exist"}
                </p>
                <p className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => window.history.back()}
                    className="bg-emerald-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
                  >
                    Go back
                  </button>
                  <Link
                    to="/"
                    className="bg-cyan-600 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
                  >
                    Start Over
                  </Link>
                </p>
            </div>
        </div>
    </Container>
  )
}
