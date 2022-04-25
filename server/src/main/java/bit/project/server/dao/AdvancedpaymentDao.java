package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Advancedpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface AdvancedpaymentDao extends JpaRepository<Advancedpayment, Integer>{
    @Query("select new Advancedpayment (a.id,a.code) from Advancedpayment a")
    Page<Advancedpayment> findAllBasic(PageRequest pageRequest);

    Advancedpayment findByCode(String code);
}