package bit.project.server.dao;

import bit.project.server.entity.Prorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProrderDao extends JpaRepository<Prorder, Integer>{
    @Query("select new Prorder (p.id,p.code,p.customorderitem,p.product,p.qty,p.dostart,p.prorderstatus) from Prorder p")
    Page<Prorder> findAllBasic(PageRequest pageRequest);

    Prorder findByCode(String code);
}