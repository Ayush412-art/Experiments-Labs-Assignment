
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {View} from 'lucide-react'

interface CardHeadProp {
  title: string;
  link: string;
}

export default function OutlinedCard({ title, link }: CardHeadProp) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <Box sx={{ minWidth: 300 }}>
      <Card
        variant="elevation"
        sx={{
             display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: "20px",
          px: "12px",
          textAlign: "center",
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.8)", // light glass
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.1), 0 6px 24px rgba(0,0,0,0.15)", // soft shadow
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          },
        }}
      >
        <CardContent>
          <Typography sx={{font : 'Tagesschrift'}} variant="h5" component="div" gutterBottom>
            {title}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleNavigation} sx={{ gap : "5px"  }} variant="outlined">view page<span><View /></span></Button>
        </CardActions>
      </Card>
    </Box>
  );
}
