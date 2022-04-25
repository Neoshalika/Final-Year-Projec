package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Productsubcategory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface ProductsubcategoryDao extends JpaRepository<Productsubcategory, Integer>{
    @Query("select new Productsubcategory (p.id,p.code,p.name) from Productsubcategory p")
    Page<Productsubcategory> findAllBasic(PageRequest pageRequest);

    @Query("select new Productsubcategory (p.id,p.code,p.name) from Productsubcategory p where p.productcategory.id =:id")
    List<Productsubcategory> findAllByCategory(@Param("id") Integer id);

    Productsubcategory findByCode(String code);
}
