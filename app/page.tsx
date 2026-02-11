import Reports from "@/components/Reports";
import Upload from "@/components/Upload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-14">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-10 p-2 px-10 md:grid-cols-2">
        <div className="space-y-6">
          <p className="mt-6 text-gray-500 leading-relaxed">
            MPESA statement PDF delivered to your email
          </p>
          <div className=" p-6">
            <h1 className="text-4xl font-bold">MPESA sTATs</h1>
            <p className="my-2 text-lg text-gray-600">
              Secure. Simple. Verified.
            </p>
          </div>
        </div>

        <div className="rounded-xl p-6">
          <div className="space-y-4 text-gray-700">
            <div className="pl-4 border-l space-y-1">
              <p className="text-sm text-gray-500">Safaricom USSD menu</p>
              <p className="font-medium text-3xl text-center">*334#</p>
              <p className="text-sm text-gray-600">My Account</p>
              <p className="text-sm text-gray-600">Request Statement</p>
              <p className="text-sm text-gray-600">Add Email Address</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Your statement is sent as a PDF to your email.
              </p>
              <p className="text-sm text-gray-500">
                PDF password is delivered via SMS.
              </p>
            </div>
          </div>
        </div>
      </div>
      <section>
        <Upload/>
        {/* <Reports/> */}
      </section>
    </main>
  );
}
