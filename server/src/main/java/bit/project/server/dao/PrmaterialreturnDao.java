package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Prmaterialreturn;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PrmaterialreturnDao extends JpaRepository<Prmaterialreturn, Integer>{
    @Query("select new Prmaterialreturn (p.id,p.code,p.prorder,p.date) from Prmaterialreturn p")
    Page<Prmaterialreturn> findAllBasic(PageRequest pageRequest);

    Prmaterialreturn findByCode(String code);
}