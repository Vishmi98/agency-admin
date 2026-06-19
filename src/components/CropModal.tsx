"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { CropModalProps } from "@/type/common.types";
import { getCroppedImg } from "@/utils/image.util";


const CropModal: React.FC<CropModalProps> = ({
  imageFile,
  onCropComplete,
  onClose,
  cropWidth = 300,
  cropHeight = 300,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageFile || !croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageFile, croppedAreaPixels, cropWidth, cropHeight);
    onCropComplete(croppedFile);
    onClose();
  };

  return (
    <Dialog
      open={!!imageFile}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }}>
        <Typography variant="h6">Crop Image</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ position: "relative", height: 400, backgroundColor: "#f5f5f5" }}>
        {imageFile && (
          <Cropper
            image={URL.createObjectURL(imageFile)}
            crop={crop}
            zoom={zoom}
            aspect={cropWidth / cropHeight}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        )}
      </DialogContent>

      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" gutterBottom>
          Zoom
        </Typography>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={(_, value) => setZoom(value as number)}
        />
      </Box>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleCrop}>
          Crop & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropModal;
