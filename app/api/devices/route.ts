
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: `OK`,data:{devices:[{id:"1",device:"Lenovo Sinkpäd",},{id:"2",user:"HP BroBook"}]} },
    { status: 200 }
  );
}
