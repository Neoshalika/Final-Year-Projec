package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Supplierpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SupplierpaymentDao extends JpaRepository<Supplierpayment, Integer>{
    @Query("select new Supplierpayment (s.id,s.code,s.purchase,s.date,s.chequeno,s.chequebank) from Supplierpayment s")
    Page<Supplierpayment> findAllBasic(PageRequest pageRequest);

    Supplierpayment findByCode(String code);
}