package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Productdisposal;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProductdisposalDao extends JpaRepository<Productdisposal, Integer>{
    @Query("select new Productdisposal (p.id,p.code) from Productdisposal p")
    Page<Productdisposal> findAllBasic(PageRequest pageRequest);

    Productdisposal findByCode(String code);
}