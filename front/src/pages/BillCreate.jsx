import React, { useState } from "react";
import { BackButton } from "../components/BackButton";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { theme } from "../helper/theme";
import { CreateBillForm } from "../components/CreateBillForm";
import { createBill } from "../apiCalls/useBill";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { AuthWrapper } from "../components/AuthWrapper";
import { QuickCreateClientForm } from "../components/QuickCreateClientForm";
import { createClient } from "../apiCalls/useClient";

export const BillCreate = () => {
  const [client, setClient] = useState({ id: '', label: '' });
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box
          sx={{
            padding: "5px",
            height: "calc(100vh - 10px)",
          }}
        >
          <BackButton route={"/bill"} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
              flexDirection: "column",
            }}
          ><Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme.primary,
            borderRadius: "15px",
            padding: "1% 2% 1% 2%",
            mb: '2%'
          }}>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  width: "250px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Kreiranje novog racuna
              </Typography>
              <Button onClick={() => setOpenDialog(true)} variant="contained">Brzo Kreiranje Korisnika?</Button>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent sx={{
                  background: theme.primary,
                  width: 420
                }}>
                  <QuickCreateClientForm mutationFunction={createClient} setOpenDialog={setOpenDialog} setClient={setClient} />
                </DialogContent>
              </Dialog>
            </Box>
            <CreateBillForm mutationFunction={createBill} client={client} setClient={setClient} />
          </Box>
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
