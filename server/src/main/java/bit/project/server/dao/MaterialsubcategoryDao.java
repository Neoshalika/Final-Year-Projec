package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Materialsubcategory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface MaterialsubcategoryDao extends JpaRepository<Materialsubcategory, Integer>{
    @Query("select new Materialsubcategory (m.id,m.code,m.materialcategory,m.name) from Materialsubcategory m")
    Page<Materialsubcategory> findAllBasic(PageRequest pageRequest);

    Materialsubcategory findByCode(String code);
}