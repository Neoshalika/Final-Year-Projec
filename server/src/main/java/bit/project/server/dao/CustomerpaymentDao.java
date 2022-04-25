package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Customerpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CustomerpaymentDao extends JpaRepository<Customerpayment, Integer>{
    @Query("select new Customerpayment (c.id,c.code,c.customerorder,c.paymenttype,c.chequeno) from Customerpayment c")
    Page<Customerpayment> findAllBasic(PageRequest pageRequest);

    Customerpayment findByCode(String code);
}