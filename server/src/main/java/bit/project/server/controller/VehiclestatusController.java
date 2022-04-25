package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Vehiclestatus;
import bit.project.server.dao.VehiclestatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/vehiclestatuses")
public class VehiclestatusController{

    @Autowired
    private VehiclestatusDao vehiclestatusDao;

    @GetMapping
    public List<Vehiclestatus> getAll(){
        return vehiclestatusDao.findAll();
    }
}