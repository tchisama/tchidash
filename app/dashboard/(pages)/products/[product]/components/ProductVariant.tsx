import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const ProductVariantsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>SKU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map variants data */}
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>Color - Red</TableCell>
              <TableCell>
                <Input type="text" defaultValue="50" />
              </TableCell>
              <TableCell>
                <Input type="text" defaultValue="100" />
              </TableCell>
              <TableCell>SKU123</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductVariantsCard;
