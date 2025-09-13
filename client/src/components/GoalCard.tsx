import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// interface goalCardProp {
//   title: string;
//   progress: number;
//   complexity: string;
  
// }



function GoalCard(goalProp: any) {
  
  const nevigate = useNavigate()
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
          backgroundColor: "rgba(255,255,255,0.8)", 
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.1), 0 6px 24px rgba(0,0,0,0.15)", 
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          },
        }}
      >
        <CardContent>
          
          <Typography
            sx={{
              fontFamily: "Tagesschrift, sans-serif",
              fontSize: "2rem",
              fontWeight: "bold",
              mb: 2,
            }}
            component="div"
            gutterBottom
          >
            {goalProp.title}
          </Typography>

         
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography>Duration: {goalProp.complexity}</Typography>

            
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderWidth: 2,
                borderColor: "rgba(0,0,0,0.6)",
                mx: 1,
              }}
            />

            <Typography>Progress: {goalProp.progress}</Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button onClick={() => nevigate("/roadmap" , {state : {goals : goalProp}}) } variant="text" sx={{display : "flex" , alignItems : "center" , gap : "2px"}} >Roadmap<span><ArrowRight /></span></Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default GoalCard;
