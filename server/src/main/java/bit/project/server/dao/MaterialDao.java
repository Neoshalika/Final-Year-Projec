package bit.project.server.dao;

import bit.project.server.entity.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface MaterialDao extends JpaRepository<Material, Integer>{
    @Query("select new Material (m.id,m.code,m.materialsubcategory,m.name,m.photo) from Material m")
    Page<Material> findAllBasic(PageRequest pageRequest);

    @Query("select new Material (m.id,m.code,m.materialsubcategory,m.name,m.photo) from Material m where m.materialstatus.id=1")
    Page<Material> findByBasicActives(PageRequest pageRequest);

    Material findByCode(String code);
}
