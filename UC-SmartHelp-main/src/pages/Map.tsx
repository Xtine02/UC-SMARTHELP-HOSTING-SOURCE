import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface BuildingFloors {
  [key: string]: string[];
}

const BUILDINGS: BuildingFloors = {
  "Admin Building": ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor", "6th Floor"],
};

const FLOOR_DATA: Record<string, Record<string, string>> = {
  "Admin Building": {
    "1st Floor": "Ground level - Main entrance, reception area",
    "2nd Floor": "Administrative offices, registrar office",
    "3rd Floor": "Dean's office, faculty offices",
    "4th Floor": "Meeting rooms, conference rooms",
    "5th Floor": "Library extension, study areas",
    "6th Floor": "Executive offices, board room",
  },
};

const MAP_BUILDING = "Admin Building";

const Map = () => {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  const availableFloors = BUILDINGS[MAP_BUILDING] || [];

  // Get available floors for the selected building
  const getFloorInfo = () => {
    if (!selectedFloor) return null;
    return FLOOR_DATA[MAP_BUILDING]?.[selectedFloor] || "Floor information not available";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-12 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Campus Map</h1>
            <p className="text-muted-foreground">
              {MAP_BUILDING} - <span className="capitalize">Select a floor to view details</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Floor Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Floor</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a floor..." />
              </SelectTrigger>
              <SelectContent>
                {availableFloors.map((floor) => (
                  <SelectItem key={floor} value={floor}>
                    {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFloor && (
              <p className="text-sm text-muted-foreground mt-3">
                Selected: <span className="font-semibold text-foreground">{selectedFloor}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Floor Details Display */}
        {selectedFloor ? (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>
                {MAP_BUILDING} - {selectedFloor}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted/20 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center max-w-md">
                  <p className="text-lg font-semibold text-foreground mb-4">{selectedFloor}</p>
                  <p className="text-muted-foreground">{getFloorInfo()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-12 pb-12">
              <div className="text-center text-muted-foreground space-y-2">
                <p className="text-lg font-semibold">Select a Floor</p>
                <p className="text-sm">Choose a floor above to view its details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Map;
