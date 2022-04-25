package bit.project.server.dao;

import bit.project.server.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface VehicleDao extends JpaRepository<Vehicle, Integer>{
    @Query("select new Vehicle (v.id,v.code,v.no,v.brand,v.modal,v.photo) from Vehicle v")
    Page<Vehicle> findAllBasic(PageRequest pageRequest);

    Vehicle findByCode(String code);
}