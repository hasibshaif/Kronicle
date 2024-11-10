export default function NavBarButtons({email}:{email:string}) {
    if (email) {
        return (
            <>
            <Link href="/dashboard" className="bg-orange-600 text-white rounded-full py-2 px-4 hover:bg-red-600">
              Dashboard
            </Link>
            <Link href="/api/logout" className="text-yellow-300 hover:text-yellow-400">Logout</Link>
          </>
        );
    } 
}