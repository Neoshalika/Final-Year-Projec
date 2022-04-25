package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Customorderitem;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface CustomorderitemDao extends JpaRepository<Customorderitem, Integer>{
    @Query("select new Customorderitem (c.id,c.code,c.customerorder) from Customorderitem c")
    Page<Customorderitem> findAllBasic(PageRequest pageRequest);

    @Query("select c from Customorderitem c")
    List<Customorderitem> findAllForProduction(PageRequest pageRequest);


    Customorderitem findByCode(String code);
}
