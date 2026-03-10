import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllUsers,
  useRevokeRecyclerVerification,
  useVerifyRecycler,
} from "../../hooks/useQueries";

export default function AdminTab() {
  const { data: allUsers = [] } = useGetAllUsers();
  const verifyRecycler = useVerifyRecycler();
  const revokeVerification = useRevokeRecyclerVerification();

  const recyclers = allUsers.filter((u) => u.userType === "recycler");

  const handleVerify = async (recyclerPrincipal: any) => {
    try {
      await verifyRecycler.mutateAsync(recyclerPrincipal);
      toast.success("Recycler verified successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify recycler");
    }
  };

  const handleRevoke = async (recyclerPrincipal: any) => {
    if (!confirm("Are you sure you want to revoke verification?")) return;

    try {
      await revokeVerification.mutateAsync(recyclerPrincipal);
      toast.success("Verification revoked successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke verification");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-muted-foreground">
          Manage users and recycler verifications
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recyclers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recyclers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Recyclers
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recyclers.filter((r) => r.isVerified).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recycler Verification</CardTitle>
          <CardDescription>Manage recycler verification status</CardDescription>
        </CardHeader>
        <CardContent>
          {recyclers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No recyclers registered yet
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recyclers.map((recycler) => (
                  <TableRow key={recycler.id.toString()}>
                    <TableCell className="font-medium">
                      {recycler.name}
                    </TableCell>
                    <TableCell>{recycler.email}</TableCell>
                    <TableCell>
                      {recycler.isVerified ? (
                        <Badge variant="default">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {recycler.isVerified ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(recycler.id)}
                          disabled={revokeVerification.isPending}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Revoke
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(recycler.id)}
                          disabled={verifyRecycler.isPending}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete user directory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((user) => (
                <TableRow key={user.id.toString()}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.userType}</TableCell>
                  <TableCell>
                    {user.userType === "recycler" && user.isVerified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
