package bit.project.server.dao;

import bit.project.server.entity.Porder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface PorderDao extends JpaRepository<Porder, Integer>{
    @Query("select new Porder (p.id,p.code,p.supplier,p.doordered,p.dorequired) from Porder p")
    Page<Porder> findAllBasic(PageRequest pageRequest);



    @Query("select p from Porder p where p.supplier.id =:id")
    List<Porder> findAllBySupplier(@Param("id") Integer id);

    Porder findByCode(String code);

    @Query("select count(e) from Porder e where e.doordered>=:startdate and e.doordered<=:enddate")
    Long getPurchaseCountByRange(@Param("startdate") LocalDate startdate, @Param("enddate")LocalDate enddate);
}
